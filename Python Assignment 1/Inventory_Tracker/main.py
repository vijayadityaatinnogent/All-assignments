from services.inventory_services import InventoryService
from NumPyStats import Stats 
import pandas as pd

def main():
    service = InventoryService()

    while True:
        print("\n===== Inventory Menu =====")
        print("1. List all products")
        print("2. Low on stock warnings")
        print("3. Add product")
        print("4. Update stock")
        print("5. Add Tag to Product")
        print("6. Delete product")
        print("7. Print total value")
        print("8. Apply discount by tag")
        print("9. Show inventory statistics")
        print("10. Show statistics by tag")
        print("11. Exit")
        print("=============================")

        choice = input("Enter your choice (1-8): ")

        if choice == "1":
            service.list_products()
        elif choice == "2":
            service.low_stock_warning()
        elif choice == "3":
            service.add_product()
        elif choice == "4":
            service.update_stock()
        elif choice == "5":
            product_name = input("Enter product name to add tag: ")
            service.add_tag_to_product(product_name)
        elif choice == "6":
            service.delete_product()
        elif choice == "7":
            service.total_value()
        elif choice == "8":
            service.apply_discount()
        elif choice == "9":
            Stats.show_stats(service)
        elif choice == "10":
            Stats.show_stats_by_tag(service)
        elif choice == "11":
            print("Exiting... Goodbye!")
            break
        else:
            print("Invalid choice. Try again.")

if __name__ == "__main__":
    main()
