import Favorites from "@/lib/components/shop/favorites/Favorites";
import { withAuth } from "@/utils/withAuth";

const FavoritesPage = () => {

    return (
        <>
            <Favorites/>
        </>
    );

}
export default FavoritesPage;

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