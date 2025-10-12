import Image from "next/image";
import { Card, CardContent, CardFooter, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";

const ProductosPopular = [
  {
    id: 1,
    name: "Adidas CoreFit T-Shirt",
    shortDescription:
      "Camiseta ligera y transpirable ideal para entrenamientos intensos.",
    description:
      "La Adidas CoreFit T-Shirt está diseñada con tejido DryFit que absorbe el sudor y mantiene la piel fresca. Perfecta para running, gimnasio o uso diario gracias a su comodidad y durabilidad.",
    price: 39.9,
    sizes: ["s", "m", "l", "xl", "xxl"],
    colors: ["gray", "purple", "green"],
    images: {
      gray: "/products/1g.png",
      purple: "/products/1p.png",
      green: "/products/1gr.png",
    },
  },
  {
    id: 2,
    name: "Puma Ultra Warm Zip",
    shortDescription:
      "Chaqueta ligera con cierre frontal y protección contra el frío.",
    description:
      "La Puma Ultra Warm Zip combina estilo y funcionalidad. Su diseño térmico ayuda a mantener el calor corporal, mientras que el cierre frontal permite ventilación y comodidad en cualquier clima.",
    price: 59.9,
    sizes: ["s", "m", "l", "xl"],
    colors: ["gray", "green"],
    images: { gray: "/products/2g.png", green: "/products/2gr.png" },
  },
  {
    id: 3,
    name: "Nike Air Essentials Pullover",
    shortDescription:
      "Sudadera con capucha suave y cómoda para el día a día.",
    description:
      "El Nike Air Essentials Pullover ofrece un diseño moderno con capucha ajustable y bolsillo frontal tipo canguro. Fabricado en algodón y poliéster, brinda suavidad y abrigo en cualquier ocasión.",
    price: 69.9,
    sizes: ["s", "m", "l"],
    colors: ["green", "blue", "black"],
    images: {
      green: "/products/3gr.png",
      blue: "/products/3b.png",
      black: "/products/3bl.png",
    },
  },
  {
    id: 4,
    name: "Nike Dri Flex T-Shirt",
    shortDescription:
      "Camiseta deportiva de secado rápido y ajuste flexible.",
    description:
      "La Nike Dri Flex T-Shirt está fabricada con tecnología de secado rápido que mantiene la piel libre de humedad. Su diseño ligero y flexible la convierte en una prenda ideal para entrenamientos intensos.",
    price: 29.9,
    sizes: ["s", "m", "l"],
    colors: ["white", "pink"],
    images: { white: "/products/4w.png", pink: "/products/4p.png" },
  },
];

const latestTransactions = [
  {
    id: 1,
    title: "Pagos de servicios",
    badge: "John Doe",
    image:
      "https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=800",
    count: 1400,
  },
  {
    id: 2,
    title: "Pedidos de pagos",
    badge: "Jane Smith",
    image:
      "https://images.pexels.com/photos/4969918/pexels-photo-4969918.jpeg?auto=compress&cs=tinysrgb&w=800",
    count: 2100,
  },
  {
    id: 3,
    title: "Pedidos de pagos",
    badge: "Michael Johnson",
    image:
      "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=800",
    count: 1300,
  },
  {
    id: 4,
    title: "Pagos de servicios",
    badge: "Lily Adams",
    image:
      "https://images.pexels.com/photos/712513/pexels-photo-712513.jpeg?auto=compress&cs=tinysrgb&w=800",
    count: 2500,
  },
  {
    id: 5,
    title: "Pagos de servicios",
    badge: "Sam Brown",
    image:
      "https://images.pexels.com/photos/1680175/pexels-photo-1680175.jpeg?auto=compress&cs=tinysrgb&w=800",
    count: 1400,
  },
];

const CardList = ({ title }: { title: string }) => {

  return (
    <div className="">
      <h1 className="text-lg font-medium mb-6">{title}</h1>
      <div className="flex flex-col gap-2">
        {title == "Productos Populares" ? ProductosPopular.map((item) => (
          <Card key={item.id} className="flex-row items-center justify-between gap-4 p-4">
            <div className="w-12 h-12 rounded-sm relative overflow-hidden">
              <Image
                src={Object.values(item.images)[0] || ""}
                alt={item.name}
                fill
                className="object-cover"
              />
            </div>
            <CardContent className="flex-1 p-0">
              <CardTitle className="text-sm font-medium">{item.name}</CardTitle>
            </CardContent>
            <CardFooter className="p-0">${item.price / 1000}K</CardFooter>
          </Card>)
        ) : latestTransactions.map((item) => (
          <Card key={item.id} className="flex-row items-center justify-between gap-4 p-4">
            <div className="w-12 h-12 rounded-sm relative overflow-hidden">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover"
              />
            </div>
            <CardContent className="flex-1 p-0">
              <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
              <Badge variant={"secondary"}>{item.badge}</Badge>
            </CardContent>
            <CardFooter className="p-0">${item.count / 1000}K</CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CardList;