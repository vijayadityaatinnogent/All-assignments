from models.products import Product

LOW_STOCK = 5

prod = Product

class InventoryService:
    def __init__(self):
        self.inventory = []

    def list_products(self):
        if not self.inventory:
            print("\nNo products in inventory.")
        else:
            print("\n--- Product List ---")
            for product in self.inventory:
                print(product)

    def add_product(self):
        name = input("\nEnter product name: ")
        stock = int(input("Enter stock quantity: "))
        price = float(input("Enter price: "))
        location = input("Enter location (e.g., shelf-1): ")
        tags = input("Enter tags (comma separated): ").split(",")
        product = Product(name, stock, price, location, tags)
        self.inventory.append(product)
        print(f"\n --- {name} added successfully! ---")
    
    def add_tag_to_product(self, product_name):
        for p in self.inventory:
            if p.name.lower() == product_name.lower():
                p.add_tag(input("Enter new tag to add: ").strip())
                return
        print(f"Product '{product_name}' not found in inventory.")

    def update_stock(self):
        name = input("\nEnter product name to update stock: ")
        for p in self.inventory:
            if p.name.lower() == name.lower():
                new_stock = int(input("Enter new stock: "))
                p.stock = new_stock
                print(f"\n --- {p.name} stock updated to {p.stock} ---")
                return
        print("Product not found.")

    def delete_product(self):
        name = input("Enter product name to delete: ")
        for p in self.inventory:
            if p.name.lower() == name.lower():
                self.inventory.remove(p)
                print(f"{name} deleted successfully.")
                return
        print("Product not found.")

    def low_stock_warning(self):
        print("\n--- Low Stock Products ---")
        found = False
        for p in self.inventory:
            if p.stock <= LOW_STOCK:
                print(p)
                found = True
        if not found:
            print("\nNo low-stock products.")

    def total_value(self):
        total = sum(p.total_value_of_product() for p in self.inventory)
        print(f"\nTotal Inventory Value: ₹{total:.2f}")

    def apply_discount(self):
        print("\n--- Discounted Products ---")

        # Discount mapping (tag_name: price_multiplier)
        DISCOUNTS = {
            "clearance": 0.5,   # 50% off
            "seasonal": 0.7,    # 30% off
            "grocery": 0.8,     # 20% off
            "medical": 0.65     # 35% off
        }

        found = False
        for p in self.inventory:
            # Normalize tags to lowercase and remove extra spaces
            tags = {t.lower().strip() for t in p.tags}

            for tag, multiplier in DISCOUNTS.items():
                if tag in tags:
                    discounted_price = round(p.price * multiplier, 2)
                    print(f"{p.name}: [{tag}] Old Price ₹{p.price:.2f} → New Price ₹{discounted_price:.2f}")
                    found = True
                    break  # Apply only the first matching discount

        if not found:
            print("No discounted products found.")
