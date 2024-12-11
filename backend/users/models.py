from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='userprofile')
    calorie_target = models.IntegerField(default=2000)
    dietary_restrictions = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return f"{self.user.email}'s profile"
