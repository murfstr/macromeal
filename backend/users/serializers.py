from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['calorie_target', 'dietary_restrictions']

class SignUpSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    class Meta:
        model = User
        fields = ['email', 'password']
    def create(self, validated_data):
        email = validated_data['email']
        password = validated_data['password']
        user = User.objects.create_user(username=email, email=email, password=password)
        UserProfile.objects.create(user=user)
        return user