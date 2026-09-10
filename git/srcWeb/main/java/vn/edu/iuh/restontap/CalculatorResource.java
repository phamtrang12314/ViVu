package vn.edu.iuh.restontap;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.Map;

@Path("/calc")
@Produces(MediaType.APPLICATION_JSON)
public class CalculatorResource {
    @GET
    @Path("/{operator}/{a}/{b}")
    public Response calculate(
            @PathParam("operator") String operator,
            @PathParam("a") double a,
            @PathParam("b") double b
    ) {
        double result;

        switch (operator) {
            case "add":
                result = a + b;
                break;
            case "sub":
                result = a - b;
                break;
            case "mul":
                result = a * b;
                break;
            case "div":
                if (b == 0) {
                    return Response.status(Response.Status.BAD_REQUEST)
                            .entity(Map.of("message", "Khong the chia cho 0"))
                            .build();
                }
                result = a / b;
                break;
            default:
                return Response.status(Response.Status.BAD_REQUEST)
                        .entity(Map.of("message", "Phep tinh khong hop le"))
                        .build();
        }

        return Response.ok(Map.of(
                "a", a,
                "b", b,
                "operator", operator,
                "result", result
        )).build();
    }
}
