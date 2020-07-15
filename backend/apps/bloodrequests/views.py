import datetime

from django.core.mail import EmailMessage
from django.shortcuts import render

# Create your views here.

from rest_framework import status
from rest_framework.generics import CreateAPIView, ListAPIView, RetrieveUpdateDestroyAPIView, UpdateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from apps.bloodrequests.models import BloodRequest
from apps.bloodrequests.permissions import IsRequesterOrAdminOrReadOnly, IsDonorOrReadOnly
from apps.bloodrequests.serializers import BloodRequestSerializer
from apps.donorprofiles.models import DonorProfile
from apps.donorprofiles.serializers import DonorProfileSerializer
from apps.users.permissions import ReadOnly


class CreateBloodRequestView(CreateAPIView):
    """
    GET:
    List all Requests.
    POST:
    Create a Request.
    """
    serializer_class = BloodRequestSerializer
    permission_classes = [IsAuthenticated | ReadOnly]

    def get_target_blood_type_emails(self, blood_group):
        target_blood_type_emails = []
        for donor_profile in DonorProfile.objects.all():
            if donor_profile.blood_group == blood_group:
                target_blood_type_emails.append(donor_profile.user.email)
        return target_blood_type_emails

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(seeker=self.request.user.seeker_profile)
        target_emails = self.get_target_blood_type_emails(serializer.validated_data.get('blood_group'))
        email = EmailMessage()
        email.subject = '{seeker_name} is looking for blood donations!'.format(
            seeker_name=request.user.seeker_profile.name)
        email.body = '{seeker_name} is looking for donors with a blood type of {request_blood_type}.\nYou your blood type seems to match, be sure to contact them at {seeker_street}, {seeker_zip_code}!'.format(
            seeker_name=request.user.seeker_profile.name, request_blood_type=serializer.validated_data.get('blood_group'),
            seeker_street=request.user.seeker_profile.street, seeker_zip_code=request.user.seeker_profile.zip_code)
        email.to = target_emails
        email.send(fail_silently=False)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class ListAllBloodRequestsView(ListAPIView):
    """
    GET:
    List all Blood Requests in most recently created order.
    """
    serializer_class = BloodRequestSerializer
    permission_classes = [IsAuthenticated | ReadOnly]

    def list(self, request, *args, **kwargs):
        queryset = BloodRequest.objects.all().order_by('-created')
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class RetrieveUpdateDestroyBloodRequestView(RetrieveUpdateDestroyAPIView):
    """
    UPDATE:
    Update Request.
    GET:
    Retrieve single Request.
    DELETE:
    Delete Request.
    """
    permission_classes = [IsRequesterOrAdminOrReadOnly]
    queryset = BloodRequest.objects.all()
    serializer_class = BloodRequestSerializer
    lookup_url_kwarg = 'request_id'
    http_method_names = ['get', 'patch', 'delete']

    def perform_update(self, serializer):
        serializer.save(seeker=self.request.user.seeker_profile)


class ToggleApplyToRequestView(CreateAPIView):
    """
    POST:
    Toggle applying to a blood request by including the target
    blood request in the url.
    """
    permission_classes = [IsDonorOrReadOnly]
    queryset = BloodRequest
    serializer_class = BloodRequestSerializer
    lookup_url_kwarg = 'request_id'

    def post(self, request, *args, **kwargs):
        receiver = self.get_object()  # We found the post with 'post_id'
        requester = self.request.user.donor_profile
        apply_relation = requester in receiver.applicants.all()
        if apply_relation:
            receiver.applicants.remove(requester)
        else:
            receiver.applicants.add(requester)
        return Response(self.get_serializer(receiver).data)


class ListApplicantsOfSpecificRequestView(ListAPIView):
    """
    GET:
    List all applicants of a single blood request by including the target
    blood request ID in the url.
    """
    permission_classes = [IsAuthenticated | ReadOnly]
    serializer_class = DonorProfileSerializer
    lookup_url_kwarg = 'request_id'
    queryset = BloodRequest

    def list(self, request, *args, **kwargs):
        target_blood_request = self.get_object()
        target_applicants = target_blood_request.applicants.all()
        serializer = self.get_serializer(target_applicants, many=True)
        return Response(serializer.data)


class SelectDonorFromApplicantsView(CreateAPIView):
    """
    POST:
    Select a donor from the list of applicants in the Request with the,
    blood request ID in the url. If the chosen donor is already the selected donor, he will be toggled out.
    """
    permission_classes = [IsRequesterOrAdminOrReadOnly]
    queryset = BloodRequest
    serializer_class = BloodRequestSerializer
    lookup_url_kwarg = 'request_id'

    def post(self, request, *args, **kwargs):
        target_blood_request = self.get_object()  # We found the post with 'post_id'
        target_applicant = DonorProfile.objects.get(id=self.kwargs['donor_id'])
        if target_applicant == target_blood_request.selected_donor:
            target_blood_request.selected_donor = None
            target_blood_request.status = "OP"
            target_blood_request.save()
            return Response(self.get_serializer(target_blood_request).data)
        elif target_applicant in target_blood_request.applicants.all():
            target_blood_request.selected_donor = target_applicant
            target_blood_request.status = "CL"
            target_blood_request.save()
            email = EmailMessage()
            email.subject = 'Congratulations you have been Selected for a Blood Donation!'
            email.body = '{seeker_name} would like you to come and donate blood at their site at {seeker_street}, {seeker_zip_code}!'.format(
                seeker_name=request.user.seeker_profile.name,
                seeker_street=request.user.seeker_profile.street, seeker_zip_code=request.user.seeker_profile.zip_code)
            email.to = [target_applicant.user.email]
            email.send(fail_silently=False)
            return Response(self.get_serializer(target_blood_request).data)
        else:
            return Response({"detail": "Your selected Donor is not an applicant!"}, status=status.HTTP_400_BAD_REQUEST)


class MarkRequestAsOpenView(CreateAPIView):
    permission_classes = [IsRequesterOrAdminOrReadOnly]
    queryset = BloodRequest
    serializer_class = BloodRequestSerializer
    lookup_url_kwarg = 'request_id'

    def post(self, request, *args, **kwargs):
        target_blood_request = self.get_object()  # We found the post with 'post_id'
        target_blood_request.status = "OP"
        target_blood_request.save()
        return Response(self.get_serializer(target_blood_request).data)


class MarkRequestAsCompletedView(CreateAPIView):
    permission_classes = [IsRequesterOrAdminOrReadOnly]
    queryset = BloodRequest
    serializer_class = BloodRequestSerializer
    lookup_url_kwarg = 'request_id'

    def post(self, request, *args, **kwargs):
        target_blood_request = self.get_object()
        target_donor = target_blood_request.selected_donor
        if target_donor is None:
            return Response({"detail": "You cannot complete a request with no selected donor"},
                            status=status.HTTP_400_BAD_REQUEST)
        elif target_blood_request.status == "COM":
            return Response({"detail": "This request has already been completed"},
                            status=status.HTTP_400_BAD_REQUEST)
        else:
            target_blood_request.status = "COM"
            target_donor.last_donation = datetime.datetime.now()
            target_donor.total_points += int(target_blood_request.points_value)
            target_donor.save()
            target_blood_request.save()
            if target_blood_request.is_renewable:
                cloned_blood_request = BloodRequest.objects.get(id=target_blood_request.id)
                cloned_blood_request.id = None
                cloned_blood_request.save()
                cloned_blood_request.status = 'OP'
                cloned_blood_request.selected_donor = None
                cloned_blood_request.applicants.clear()
                cloned_blood_request.save()
            email = EmailMessage()
            email.subject = 'Thanks for Donating :)'
            email.body = '{seeker_name} would like you to thank you for your generous blood donation.\n{points_value} points have been added to your profile, enjoy!'.format(
                seeker_name=request.user.seeker_profile.name, points_value=target_blood_request.points_value)
            email.to = [target_donor.user.email]
            email.send(fail_silently=False)
            return Response(self.get_serializer(target_blood_request).data)
