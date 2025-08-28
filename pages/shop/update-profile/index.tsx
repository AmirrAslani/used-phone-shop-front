import UpdateProfileForm from "@/lib/components/shop/updateProfile/UpdateProfile";
import { withAuth } from "@/utils/withAuth";

const UpdateProfilesPage = () => {

    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 pt-10 p-2">
                <UpdateProfileForm />
            </div>
        </>
    );

}
export default UpdateProfilesPage;

export const getServerSideProps = withAuth(
    async () => {
      return { props: {} };
    },
    {
      destination: "/",
      permanent: false,
      redirectIf: (token) => !token
    }
);