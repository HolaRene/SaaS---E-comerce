"use client";

import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { ScrollArea } from "./ui/scroll-area";

const categories = [
  "T-shirts",
  "Shoes",
  "Accessories",
  "Bags",
  "Dresses",
  "Jackets",
  "Gloves",
] as const;

const colors = [
  "blue",
  "green",
  "red",
  "yellow",
  "purple",
  "orange",
  "pink",
  "brown",
  "gray",
  "black",
  "white",
] as const;

const sizes = [
  "xs",
  "s",
  "m",
  "l",
  "xl",
  "xxl",
  "34",
  "35",
  "36",
  "37",
  "38",
  "39",
  "40",
  "41",
  "42",
  "43",
  "44",
  "45",
  "46",
  "47",
  "48",
] as const;

const formSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Username must be at least 2 characters!" }),
  shortDescription: z.string({ message: "la corta descripción es requerida" }).min(2, { message: "la descripción debe ser mayor a uno" }).max(60, { message: "la descripción debe ser menor a 60 caracteres" }),
  description: z.string().min(1),
  price: z.number().min(1),
  category: z.enum(categories),
  sizes: z.array(z.enum(sizes)),
  colors: z.array(z.enum(colors)),
  images: z.record(z.enum(colors), z.string()),
});

const AddProduct = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  return (
    <SheetContent>
      <ScrollArea className="h-screen">
        <SheetHeader>
          <SheetTitle className="mb-4">Agregar producto</SheetTitle>
          <SheetDescription asChild>
            <Form {...form}>
              <form className="space-y-8">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre del producto</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>
                        Pon el nombre del producto
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="shortDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descripción breve</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>
                        Pon una corta descripción del producto
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descripción</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormDescription>
                        Pon una descripción del producto
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Precio</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" />
                      </FormControl>
                      <FormDescription>
                        Precio del producto en USD
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categorias</FormLabel>
                      <FormControl>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona una categoria" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem
                                key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormDescription>
                        Categoria del producto
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sizes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tallas</FormLabel>
                      <FormControl>
                        <div className="grid grid-cols-3 gap-4 my-2">
                          {
                            sizes.map((talla) => (
                              <div className="flex items-center gap-2" key={talla}>
                                <Checkbox id="size" checked={field.value?.includes(talla)} onCheckedChange={(chex) => {
                                  const valorActual = field.value || [];
                                  if (chex) {
                                    field.onChange([...valorActual, talla])
                                  } else {
                                    field.onChange(valorActual.filter(v => v !== talla))
                                  }
                                }} />
                                <label htmlFor="size" className="text-xs">{talla}</label>
                              </div>
                            ))
                          }
                        </div>
                      </FormControl>
                      <FormDescription>
                        Pon la talla  del producto
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="colors"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Colores</FormLabel>
                      <FormControl>
                        <div className="space-y-4">
                          <div className="grid grid-cols-3 gap-4 my-2">
                            {
                              colors.map((color) => (
                                <div className="flex items-center gap-2" key={color}>
                                  <Checkbox id="colores" checked={field.value?.includes(color)} onCheckedChange={(chex) => {
                                    const valorActual = field.value || [];
                                    if (chex) {
                                      field.onChange([...valorActual, color])
                                    } else {
                                      field.onChange(valorActual.filter(c => c !== color))
                                    }
                                  }} />
                                  <label htmlFor="colores" className="text-xs flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full" style={{
                                      backgroundColor: color
                                    }} />
                                    {color}
                                  </label>
                                </div>
                              ))
                            }
                          </div>
                          {field.value && field.value?.length > 0 && (
                            <div className="mt-8 space-y-4">
                              <p className="text-sm font-medium">Subir img desde el color</p>
                              {field.value.map((color) => (
                                <div key={color} className="flex items-center gap-2">
                                  <div className="h-2 w-2 rounded-full" style={{
                                    backgroundColor: color
                                  }} />
                                  <span className="text-sm min-w-[60px]">{color}</span>
                                  <Input type="file" accept="image/*" />
                                </div>
                              )
                              )}
                            </div>
                          )}
                        </div>
                      </FormControl>

                      <FormDescription>
                        Pon el color  del producto
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Submit</Button>
              </form>
            </Form>
          </SheetDescription>
        </SheetHeader>
      </ScrollArea>
    </SheetContent>
  );
};

export default AddProduct;
