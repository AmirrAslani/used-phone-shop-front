import Orders from "@/lib/components/shop/orders/Orders";
import { withAuth } from "@/utils/withAuth";

const OrdersPage = () => {

    return (
        <>
            <Orders/>
        </>
    );

}
export default OrdersPage;

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