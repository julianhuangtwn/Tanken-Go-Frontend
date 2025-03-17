import { Toaster } from "@/components/ui/sonner"

export default function PlanAILayout({ children }) {
    return (
        <div>
            {children}
            <Toaster/>
        </div>
    )
}