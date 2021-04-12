package com.example.countrywebapi.controllers;

import com.example.countrywebapi.data.Country;
import com.example.countrywebapi.data.CountryRepository;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

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

   @GetMapping("/countries/{id}")
   public Country getCountry(@PathVariable int id) {
      return repo.getById(id);
   }

   @GetMapping("/countries/search")
   public Iterable<Country> getCountry(@RequestParam String name) {
      return repo.searchByName(name);
   }

   @PostMapping("/countries")
   public Country addCountry(@RequestBody Country country)
   {
      if(country == null) {
         return null;
      }

       repo.save(country);
       return country;
   }
}
