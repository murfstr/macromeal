from django.db import models
from django.contrib.auth.models import User

class Recipe(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='recipes')
    title = models.CharField(max_length=255)
    ingredients = models.JSONField()
    instructions = models.JSONField()
    is_favorite = models.BooleanField(default=False)

    def __str__(self):
        return self.title