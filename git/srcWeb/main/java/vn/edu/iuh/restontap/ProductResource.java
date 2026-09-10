package vn.edu.iuh.restontap;

import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Path("/products")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class ProductResource {
    private static final List<Product> products = new ArrayList<>();
    private static int nextId = 4;

    static {
        products.add(new Product(1, "Laptop", 1500));
        products.add(new Product(2, "Keyboard", 80));
        products.add(new Product(3, "Mouse", 40));
    }

    @GET
    public List<Product> findAll() {
        return products;
    }

    @GET
    @Path("/{id}")
    public Response findById(@PathParam("id") int id) {
        Optional<Product> product = findProduct(id);

        if (product.isEmpty()) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(Map.of("message", "Khong tim thay san pham"))
                    .build();
        }

        return Response.ok(product.get()).build();
    }

    @POST
    public Response create(Product product) {
        product.setId(nextId);
        nextId++;
        products.add(product);

        return Response.status(Response.Status.CREATED)
                .entity(product)
                .build();
    }

    @PUT
    @Path("/{id}")
    public Response update(@PathParam("id") int id, Product newProduct) {
        Optional<Product> oldProduct = findProduct(id);

        if (oldProduct.isEmpty()) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(Map.of("message", "Khong tim thay san pham"))
                    .build();
        }

        Product product = oldProduct.get();
        product.setName(newProduct.getName());
        product.setPrice(newProduct.getPrice());

        return Response.ok(product).build();
    }

    @DELETE
    @Path("/{id}")
    public Response delete(@PathParam("id") int id) {
        boolean removed = products.removeIf(product -> product.getId() == id);

        if (!removed) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(Map.of("message", "Khong tim thay san pham"))
                    .build();
        }

        return Response.noContent().build();
    }

    private Optional<Product> findProduct(int id) {
        return products.stream()
                .filter(product -> product.getId() == id)
                .findFirst();
    }
}
