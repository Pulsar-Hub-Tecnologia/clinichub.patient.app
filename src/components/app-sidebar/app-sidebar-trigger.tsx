import { SidebarTrigger } from "../ui/sidebar";

export default function SidebarHeader() {

    return(
        <header className="w-full flex items-center justify-start px-4 pt-2 border-none md:hidden">
            <SidebarTrigger className="text-gray-700 hover:text-gray-900" />
        </header>
    )
}