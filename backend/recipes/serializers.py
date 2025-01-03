# serializers.py

from rest_framework import serializers
from .models import Recipe, Ingredient, RecipeIngredient
from django.contrib.auth.models import User

class IngredientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ingredient
        fields = ['id', 'name', 'calories']
        read_only_fields = ['id']

class RecipeIngredientSerializer(serializers.ModelSerializer):
    ingredient = IngredientSerializer(read_only=True)
    ingredient_id = serializers.IntegerField(write_only=True)
    quantity = serializers.CharField(required=False, allow_blank=True, allow_null=True)

    class Meta:
        model = RecipeIngredient
        fields = ['id', 'ingredient', 'ingredient_id', 'quantity']

class RecipeSerializer(serializers.ModelSerializer):
    recipe_ingredients = RecipeIngredientSerializer(many=True, required=False)

    class Meta:
        model = Recipe
        fields = ['id', 'user', 'name', 'description', 'calories', 'created_at', 'recipe_ingredients']
        read_only_fields = ['user', 'created_at', 'calories']

    def create(self, validated_data):
        recipe_ingredients_data = validated_data.pop('recipe_ingredients', [])
        recipe = Recipe.objects.create(user=self.context['request'].user, **validated_data)

        errors = {}
        used_ingredient_ids = set()
        total_calories = 0
        for index, ri_data in enumerate(recipe_ingredients_data):
            ingredient_id = ri_data.pop('ingredient_id', None)
            if ingredient_id in used_ingredient_ids:
                errors[f"recipe_ingredients[{index}].ingredient_id"] = f"Duplicate ingredient_id {ingredient_id} in this recipe."
                continue
            used_ingredient_ids.add(ingredient_id)

            try:
                ingredient = Ingredient.objects.get(id=ingredient_id, user=self.context['request'].user)
                total_calories += ingredient.calories
            except Ingredient.DoesNotExist:
                errors[f"recipe_ingredients[{index}].ingredient_id"] = f"Ingredient with id {ingredient_id} does not exist or does not belong to the user."
                continue

            RecipeIngredient.objects.create(recipe=recipe, ingredient=ingredient, **ri_data)

        recipe.calories = total_calories
        recipe.save()

        if errors:
            raise serializers.ValidationError(errors)

        return recipe

    def update(self, instance, validated_data):
        recipe_ingredients_data = validated_data.pop('recipe_ingredients', None)
        instance = super().update(instance, validated_data)

        if recipe_ingredients_data is not None:
            instance.recipe_ingredients.all().delete()

            errors = {}
            used_ingredient_ids = set()
            total_calories = 0
            for index, ri_data in enumerate(recipe_ingredients_data):
                ingredient_id = ri_data.pop('ingredient_id', None)
                if ingredient_id in used_ingredient_ids:
                    errors[f"recipe_ingredients[{index}].ingredient_id"] = f"Duplicate ingredient_id {ingredient_id} in this recipe."
                    continue
                used_ingredient_ids.add(ingredient_id)

                try:
                    ingredient = Ingredient.objects.get(id=ingredient_id, user=self.context['request'].user)
                    total_calories += ingredient.calories
                except Ingredient.DoesNotExist:
                    errors[f"recipe_ingredients[{index}].ingredient_id"] = f"Ingredient with id {ingredient_id} does not exist or does not belong to the user."
                    continue

                RecipeIngredient.objects.create(
                    recipe=instance,
                    ingredient=ingredient,
                    **ri_data
                )

            instance.calories = total_calories
            instance.save()

            if errors:
                raise serializers.ValidationError(errors)

        return instance
