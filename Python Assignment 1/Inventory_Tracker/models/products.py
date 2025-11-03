class Product:
    def __init__(self, name, stock, price, location, tags):
        self.name = name
        self.stock = stock
        self.price = price
        self.location = location
        self.tags = set(tags)
    
    def add_tag(self, tag):
        """Add a new tag to the product"""
        if tag not in self.tags:
            self.tags.add(tag)
            print(f"Tag '{tag}' added to {self.name}.")
        else:
            print(f"Tag '{tag}' already exists for {self.name}.")
    
    def total_value_of_product(self):
        return self.stock * self.price

    def __str__(self):
        return (f"Name: {self.name} | Stock: {self.stock} | Price: ₹{self.price} | "
                f"Location: {self.location} | Tags: {', '.join(self.tags)}")
