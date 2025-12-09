// src/services/productService.ts

import { Query } from 'express-serve-static-core';

interface DbFilter {
  [key: string]: any;
  price?: { $gte?: number, $lte?: number };
  name?: { $regex: RegExp };
}

class ProductService {


  public async findWithFilters(queryFilters: Query): Promise<any[]> {

    const filter: DbFilter = {};


    if (queryFilters.category && typeof queryFilters.category === 'string') {
      filter.category = queryFilters.category;
    }


    if (queryFilters.name && typeof queryFilters.name === 'string') {
      filter.name = { $regex: new RegExp(queryFilters.name, 'i') };
    }


    const minPrice = queryFilters.minPrice ? parseFloat(queryFilters.minPrice as string) : null;
    const maxPrice = queryFilters.maxPrice ? parseFloat(queryFilters.maxPrice as string) : null;

    if (minPrice || maxPrice) {
      filter.price = {};

      if (minPrice && !isNaN(minPrice)) {
        filter.price.$gte = minPrice;
      }
      if (maxPrice && !isNaN(maxPrice)) {
        filter.price.$lte = maxPrice;
      }
    }


    console.log("Filtro aplicado a la BD:", filter);
    return [];
  }
}

export default new ProductService();