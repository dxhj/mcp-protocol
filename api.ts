// api.ts
import express, { Request, Response } from "express";
import { z } from "zod";
import { User, Car, CarsResponse, ErrorResponse } from "./types";

const app = express();

const users: User[] = [
    { id: 1, name: "Victor", email: "victor@domain.com" },
    { id: 2, name: "Maria", email: "maria@domain.com" },
];

const cars: Car[] = [
    { id: 1, brand: "Toyota", model: "Corolla", year: 2022, price: 120000 },
    { id: 1, brand: "Toyota", model: "Hilux", year: 2025, price: 180000 },
    { id: 2, brand: "Honda", model: "Civic", year: 2021, price: 115000 },
    { id: 3, brand: "Ford", model: "Mustang", year: 2020, price: 250000 },
    { id: 4, brand: "Volkswagen", model: "Golf", year: 2019, price: 90000 },
    { id: 5, brand: "Chevrolet", model: "Onix", year: 2023, price: 80000 }
];


app.get("/users/:id", (req: Request, res: Response<User | ErrorResponse>) => {
    const id = Number(req.params.id);
    
    if (isNaN(id) || id <= 0) {
        return res.status(400).json({ error: "Invalid user ID" });
    }
    
    const user = users.find((u: User) => u.id === id);

    if (!user) {
        return res.status(404).json({ error: "Not found" });
    }
    
    return res.json(user);
});

app.get("/cars", (req: Request, res: Response<CarsResponse | ErrorResponse>) => {
    try {
        const QuerySchema = z.object({
            id: z.coerce.number().int().positive().optional(),
            brand: z.string().optional(),
            model: z.string().optional(),
            year: z.coerce.number().int().positive().optional(),
            maxPrice: z.coerce.number().int().positive().optional(),
        });

        type QueryParams = z.infer<typeof QuerySchema>;
        const validatedParams: QueryParams = QuerySchema.parse(req.query);
        let result: Car[] = cars;

        if (validatedParams.brand) {
            const brand = validatedParams.brand.toLowerCase();
            result = result.filter((c: Car) => c.brand.toLowerCase().includes(brand));
        }

        if (validatedParams.model) {
            const model = validatedParams.model.toLowerCase();
            result = result.filter((c: Car) => c.model.toLowerCase().includes(model));
        }

        if (validatedParams.year !== undefined) {
            result = result.filter((c: Car) => c.year === validatedParams.year);
        }

        if (validatedParams.maxPrice !== undefined && validatedParams.maxPrice !== null) {
            const maxPrice = validatedParams.maxPrice;
            result = result.filter((c: Car) => c.price <= maxPrice);
        }

        return res.json({
            content: result
        });

    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                error: 'Invalid query parameters',
                details: error.issues,
            });
        }
        
        console.error("Erro no endpoint /cars:", error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(3000, () => {
    console.log("API Express rodando em http://localhost:3000");
});