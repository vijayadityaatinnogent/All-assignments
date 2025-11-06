import {ShoppingCart, Bell, User} from "lucide-react";

export default function Header() {

    return (
        <header className="bg-blue-600 text-white flex justify-between items-center p-4 shadow-md">
            <div className="flex items-center gap-3">
                <img src="/logo.jpg" alt="Logo" className="w-10 h-10 rounded-lg  mr-2 cursor-pointer" />
            <h1 className="text-xl font-bold">
                E-Commerce Store
            </h1>
            </div>
            <div className="flex gap-4">
                <ShoppingCart className="cursor-pointer" size={24} style={{marginRight: '15px'}}/>
                <Bell className="cursor-pointer" size={24} style={{marginRight: '15px'}}/>
                <User className="cursor-pointer" size={24} style={{marginRight: '15px'}}/>
            </div>

        </header>
    );
}