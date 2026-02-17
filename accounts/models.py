from django.contrib.auth.models import AbstractUser, User
from django.db import models


class User(AbstractUser):
    balance = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    earnings = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    tasks_completed = models.IntegerField(default=0)
    referrals = models.IntegerField(default=0)

class Task(models.Model):
    title = models.CharField(max_length=255)
    payout = models.FloatField(default=0)
    available = models.IntegerField(default=0)
    icon = models.CharField(max_length=255, default="task.png")
    short_desc = models.CharField(max_length=255, default="")
    platforms = models.CharField(max_length=120, default="")

    TASK_TYPES = (
        ("normal", "Normal"),
        ("membership", "Membership"),
    )

    task_type = models.CharField(
        max_length=20,
        choices=TASK_TYPES,
        default="normal"
    )

    # NEW fields
    instructions = models.TextField(default="Follow the task instructions.")
    link = models.URLField(blank=True, null=True)

    def __str__(self):
        return self.title

    

class Product(models.Model):
    seller = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField()
    image = models.ImageField(upload_to="products/")
    category = models.CharField(max_length=100)
    is_sold = models.BooleanField(default=False)


    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="images")
    image = models.ImageField(upload_to="products/")


