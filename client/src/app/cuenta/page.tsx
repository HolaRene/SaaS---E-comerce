import { LpNavbar1 } from "@/components/landing/nav/LpNavbar1";
import { UserProfile } from "@clerk/nextjs";

const AccountPage = () => {
    return (
        <div className="">
            <LpNavbar1 />
            <div className="py-10">
                <UserProfile />
            </div>
        </div>
    );
}

export default AccountPage;
