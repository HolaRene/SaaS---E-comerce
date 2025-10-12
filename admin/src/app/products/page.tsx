import { columns, Product } from "./columns";
import { DataTable } from "./data-table";

const getData = async (): Promise<Product[]> => {
  return [
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
    {
      id: 5,
      name: "Under Armour StormFleece",
      shortDescription:
        "Chaqueta térmica con resistencia al agua y al viento.",
      description:
        "La Under Armour StormFleece combina aislamiento térmico con tecnología resistente al agua y al viento. Ideal para entrenamientos al aire libre o climas fríos sin perder movilidad.",
      price: 49.9,
      sizes: ["s", "m", "l"],
      colors: ["red", "orange", "black"],
      images: {
        red: "/products/5r.png",
        orange: "/products/5o.png",
        black: "/products/5bl.png",
      },
    },
    {
      id: 6,
      name: "Nike Air Max 270",
      shortDescription:
        "Zapatillas urbanas con amortiguación de aire visible.",
      description:
        "Las Nike Air Max 270 ofrecen comodidad superior gracias a su cámara de aire visible en el talón. Ideales para un estilo urbano moderno sin sacrificar la comodidad en el día a día.",
      price: 59.9,
      sizes: ["40", "42", "43", "44"],
      colors: ["gray", "white"],
      images: { gray: "/products/6g.png", white: "/products/6w.png" },
    },
    {
      id: 7,
      name: "Nike Ultraboost Pulse",
      shortDescription:
        "Zapatillas de alto rendimiento para running y entrenamiento.",
      description:
        "Las Nike Ultraboost Pulse están diseñadas para corredores que buscan velocidad y comodidad. Su suela Boost ofrece una amortiguación reactiva y su diseño ligero se adapta a cualquier superficie.",
      price: 69.9,
      sizes: ["40", "42", "43"],
      colors: ["gray", "pink"],
      images: { gray: "/products/7g.png", pink: "/products/7p.png" },
    },
    {
      id: 8,
      name: "Levi’s Classic Denim",
      shortDescription:
        "Jeans clásicos de mezclilla resistentes y versátiles.",
      description:
        "El Levi’s Classic Denim es un pantalón de mezclilla atemporal que nunca pasa de moda. Resistente, cómodo y versátil, combina con cualquier estilo, desde casual hasta semi-formal.",
      price: 59.9,
      sizes: ["s", "m", "l"],
      colors: ["blue", "green"],
      images: { blue: "/products/8b.png", green: "/products/8gr.png" },
    },
  ];
};

const PaymentsPage = async () => {
  const data = await getData();
  return (
    <div className="">
      <div className="mb-8 px-4 py-2 bg-secondary rounded-md">
        <h1 className="font-semibold">Todos Productos</h1>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default PaymentsPage;
