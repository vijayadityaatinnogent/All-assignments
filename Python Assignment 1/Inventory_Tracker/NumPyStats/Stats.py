import numpy as np

def show_stats(self):
    """Display statistics about inventory using NumPy"""
    if not self.inventory:
        print("\nNo products in inventory for statistics.")
        return
    
    prices = np.array([p.price for p in self.inventory])
    stocks = np.array([p.stock for p in self.inventory])
    values = np.array([p.total_value_of_product() for p in self.inventory])

    print("\n===== Inventory Statistics =====")
    print(f"Average Price: ₹{np.mean(prices):.2f}")
    print(f"Most Expensive Item Price: ₹{np.max(prices):.2f}")
    print(f"Total Quantity of All Items: {np.sum(stocks)}")
    print(f"Total Inventory Value: ₹{np.sum(values):.2f}")

    # Each product total value
    print("\n--- Individual Product Values ---")
    for p in self.inventory:
        print(f"{p.name}: ₹{p.total_value_of_product():.2f}")

# Stats for a specific tag
def show_stats_by_tag(self):
    tag = input("\nEnter a tag to filter stats (e.g., clearance): ").lower().strip()
    tagged_products = [p for p in self.inventory if tag in [t.lower().strip() for t in p.tags]]

    if not tagged_products:
        print(f"No products found with tag '{tag}'.")
    else:
        tag_prices = np.array([p.price for p in tagged_products])
        tag_values = np.array([p.total_value_of_product() for p in tagged_products])
        print(f"\n--- Stats for Tag: '{tag}' ---")
        print(f"Average Price: ₹{np.mean(tag_prices):.2f}")
        print(f"Total Inventory Value: ₹{np.sum(tag_values):.2f}")