import "reflect-metadata";
import {
  Param,
  Body,
  Get,
  Post,
  Put,
  Delete,
  JsonController,
  Params,
  NotFoundError,
  BadRequestError,
} from "routing-controllers";
import { ProductDTO } from "../dto/Product";
import { MESSAGE_ERROR } from "../const/message-error.const";
import { ProductInterface } from "../interfaces/product.interface";

@JsonController("/products")
export class ProductController {
  products: ProductInterface[] = [
    { id: 'P001', name: 'Tarjetas de Crédito', description: 'Tarjeta de consumo bajo la modalidad de crédito', logo: 'https://www.visa.com.ec/dam/VCOM/regional/lac/SPA/Default/Pay%20With%20Visa/Tarjetas/visa-signature-400x225.jpg', date_release: new Date('2023-02-01'), date_revision: new Date('2024-02-01') },
    { id: 'P002', name: 'Tarjetas de Crédito', description: 'Tarjeta de consumo bajo la modalidad de crédito', logo: 'https://www.visa.com.ec/dam/VCOM/regional/lac/SPA/Default/Pay%20With%20Visa/Tarjetas/visa-signature-400x225.jpg', date_release: new Date('2023-02-01'), date_revision: new Date('2024-02-01') },
    { id: 'P003', name: 'Tarjetas de Crédito', description: 'Tarjeta de consumo bajo la modalidad de crédito', logo: 'https://www.visa.com.ec/dam/VCOM/regional/lac/SPA/Default/Pay%20With%20Visa/Tarjetas/visa-signature-400x225.jpg', date_release: new Date('2023-02-01'), date_revision: new Date('2024-02-01') },
    { id: 'P004', name: 'Tarjetas de Crédito', description: 'Tarjeta de consumo bajo la modalidad de crédito', logo: 'https://www.visa.com.ec/dam/VCOM/regional/lac/SPA/Default/Pay%20With%20Visa/Tarjetas/visa-signature-400x225.jpg', date_release: new Date('2023-02-01'), date_revision: new Date('2024-02-01') },
    { id: 'P005', name: 'Tarjetas de Médico', description: 'Tarjeta de consumo bajo la modalidad de crédito', logo: 'https://www.visa.com.ec/dam/VCOM/regional/lac/SPA/Default/Pay%20With%20Visa/Tarjetas/visa-signature-400x225.jpg', date_release: new Date('2023-02-01'), date_revision: new Date('2024-02-01') },
    { id: 'P006', name: 'Tarjetas de Crédito', description: 'Tarjeta de consumo bajo la modalidad de crédito', logo: 'https://www.visa.com.ec/dam/VCOM/regional/lac/SPA/Default/Pay%20With%20Visa/Tarjetas/visa-signature-400x225.jpg', date_release: new Date('2023-02-01'), date_revision: new Date('2024-02-01') },
    { id: 'P007', name: 'Tarjetas de Débito', description: 'Tarjeta de consumo bajo la modalidad de crédito', logo: 'https://www.visa.com.ec/dam/VCOM/regional/lac/SPA/Default/Pay%20With%20Visa/Tarjetas/visa-signature-400x225.jpg', date_release: new Date('2023-02-01'), date_revision: new Date('2024-02-01') },
    { id: 'P008', name: 'Tarjetas de Crédito', description: 'Tarjeta de consumo bajo la modalidad de crédito', logo: 'https://www.visa.com.ec/dam/VCOM/regional/lac/SPA/Default/Pay%20With%20Visa/Tarjetas/visa-signature-400x225.jpg', date_release: new Date('2023-02-01'), date_revision: new Date('2024-02-01') },
    { id: 'P009', name: 'Tarjetas de Crédito', description: 'Tarjeta de consumo bajo la modalidad de crédito', logo: 'https://www.visa.com.ec/dam/VCOM/regional/lac/SPA/Default/Pay%20With%20Visa/Tarjetas/visa-signature-400x225.jpg', date_release: new Date('2023-02-01'), date_revision: new Date('2024-02-01') },
  ];

  @Get("")
  getAll() {
    return {
      data: [...this.products],
    };
  }

  @Get("/verification/:id")
  verifyIdentifier(@Param("id") id: number | string) {
    return this.products.some((product) => product.id === id);
  }

  @Get("/:id")
  getOne(@Param("id") id: number | string) {
    const index = this.findIndex(id);

    if(index === -1) {
      throw new NotFoundError(MESSAGE_ERROR.NotFound);
    }
    return this.products.find((product) => product.id === id);
  }

  @Post("")
  createItem(@Body({ validate:true }) productItem: ProductDTO) {
    
    const index = this.findIndex(productItem.id);

    if(index !== -1) {
      throw new BadRequestError(MESSAGE_ERROR.DuplicateIdentifier);
    }
    
    this.products.push(productItem);
    return {
      message: "Product added successfully",
      data: productItem,
    };
  }

  @Put("/:id")
  put(@Param("id") id: number | string, @Body() productItem: ProductInterface) {
    const index = this.findIndex(id);

    if(index === -1) {
      throw new NotFoundError(MESSAGE_ERROR.NotFound);
    }

    this.products[index] = {
      ...this.products[index],
      ...productItem,
    };
    return {
      message: "Product updated successfully",
      data: productItem,
    };
  }

  @Delete("/:id")
  remove(@Param("id") id: number | string) {
    const index = this.findIndex(id);

    if(index === -1) {
      throw new NotFoundError(MESSAGE_ERROR.NotFound);
    }
        
    this.products = [...this.products.filter((product) => product.id !== id)];
    return {
      message: "Product removed successfully",
    };
  }

  private findIndex(id: number | string) {
    return this.products.findIndex((product) => product.id === id);
  }

}
