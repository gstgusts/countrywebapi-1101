package com.example.countrywebapi.controllers;

import com.example.countrywebapi.data.Country;
import com.example.countrywebapi.data.CountryRepository;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/api", produces = { MediaType.APPLICATION_JSON_VALUE })
public class CountryController {

   private CountryRepository repo;

   public CountryController() {
      repo = new CountryRepository();
   }

   @GetMapping("/countries")
   public Iterable<Country> getCountries() {
      return repo.getCountries();
   }
}
