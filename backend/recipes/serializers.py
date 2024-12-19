from rest_framework import serializers
from .models import Recipe, Ingredient, RecipeIngredient

class IngredientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ingredient
        fields = ['id', 'name', 'calories']

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
        fields = ['id', 'user', 'name', 'description', 'created_at', 'recipe_ingredients']
        read_only_fields = ['user', 'created_at']

    def create(self, validated_data):
        recipe_ingredients_data = validated_data.pop('recipe_ingredients', [])
        recipe = Recipe.objects.create(user=self.context['request'].user, **validated_data)

        # Handle recipe ingredients
        for ri_data in recipe_ingredients_data:
            ingredient_id = ri_data.pop('ingredient_id')
            ingredient = Ingredient.objects.get(id=ingredient_id)
            RecipeIngredient.objects.create(recipe=recipe, ingredient=ingredient, **ri_data)

        return recipe

    def update(self, instance, validated_data):
        recipe_ingredients_data = validated_data.pop('recipe_ingredients', None)
        instance = super().update(instance, validated_data)

        if recipe_ingredients_data is not None:
            # Clear and rebuild recipe ingredients or update them
            instance.recipe_ingredients.all().delete()
            for ri_data in recipe_ingredients_data:
                ingredient_id = ri_data.pop('ingredient_id')
                ingredient = Ingredient.objects.get(id=ingredient_id)
                RecipeIngredient.objects.create(recipe=instance, ingredient=ingredient, **ri_data)

        return instance
