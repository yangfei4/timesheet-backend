package com.example.authserver.Security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.List;

@Component
public class JwtTokenProvider {

    @Value("${security.jwt.token.secret-key}")
    private String secretKey;

    public String createToken(String username, List<String> roles) {
        Claims claims = Jwts.claims().setSubject(username);
        claims.put("roles", roles);
        Date expirationDate = new Date(System.currentTimeMillis() + 3600000); // 1 hour in milliseconds

        return Jwts.builder()
                .setClaims(claims)
                .setExpiration(expirationDate)
                .signWith(SignatureAlgorithm.HS256, secretKey)
                .compact();
    }

    public boolean validateToken(String token) {
        try {
            // Parse the token and extract claims
            Claims claims = Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token).getBody();

            // Check token expiration
            Date expirationDate = claims.getExpiration();
            // Token has expired
            return !expirationDate.before(new Date());

            // If no exception is thrown, the token is considered valid
        } catch (Exception e) {
            // Log or handle the exception (e.g., token is invalid or expired)
            return false;
        }
    }

}
