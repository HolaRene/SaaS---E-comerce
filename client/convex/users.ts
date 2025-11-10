import { v } from "convex/values";
import { internalMutation } from "./_generated/server";

export const crearUser = internalMutation({
    args:{
        clerkId:v.string(),
        correo:v.string(),
        imgUrl:v.string(),
        nombre: v.string(),
        numeroTelefono: v.string()
    },
    handler:async (ctx, args)=>{
        await ctx.db.insert
    }
})