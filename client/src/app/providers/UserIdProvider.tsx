"use client";

import { createContext, useContext, type ReactNode } from "react";
import { Id } from "../../../convex/_generated/dataModel";

type UserIdContextType = {
    idUser: Id<"usuarios">;
};

const UserIdContext = createContext<UserIdContextType | undefined>(undefined);

export function UserIdProvider({
    children,
    idUser,
}: {
    children: ReactNode;
    idUser: Id<"usuarios">;
}) {
    return (
        <UserIdContext.Provider value={{ idUser }}>
            {children}
        </UserIdContext.Provider>
    );
}

export function useUserId() {
    const context = useContext(UserIdContext);
    if (context === undefined) {
        throw new Error("useUserId must be used within a UserIdProvider");
    }
    return context.idUser;
}
