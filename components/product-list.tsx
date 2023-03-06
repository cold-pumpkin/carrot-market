import { ProductsResponse } from "pages";
import useSWR from "swr";
import Item from "./item";

interface ProductListProps {
  kind: "Favorite" | "Sale" | "Purchase";
}

interface Record {
  id: number;
  product: ProductsResponse;
}

interface ProductListResponse {
  [key: string]: Record[];
}

export default function ProductList({ kind }: ProductListProps) {
  const { data } = useSWR<ProductListResponse>(`/api/users/me/records?kind=${kind}`);
  console.log('kind', kind);
  console.log('ProductList', data);
  return data ?
    (// fragment 
      <>
        {data.records?.map((record) => (
          <Item
            id={record.product.id}
            key={record.id}
            title={record.product.name}
            price={record.product.price}
            hearts={record.product._count.records}
            comments={0}
          />
        ))}
      </>
    )
    : null;
}