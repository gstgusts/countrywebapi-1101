package com.example.countrywebapi.data;

import org.hibernate.HibernateException;
import org.hibernate.SessionFactory;
import org.hibernate.cfg.Configuration;

import java.util.ArrayList;
import java.util.List;

public class CountryRepository {
    private static SessionFactory factory;

    public CountryRepository() {
        try {
            factory = new Configuration()
                    .configure()
                    .addAnnotatedClass(Country.class)
                    .buildSessionFactory();
        } catch (Throwable ex) {
            System.err.println("Failed to create sessionFactory object." + ex);
            throw new ExceptionInInitializerError(ex);
        }
    }

    public List<Country> getCountries() {
        var session = factory.openSession();

        try {
            return session.createQuery("FROM Country").list();
        } catch (HibernateException ex) {
            System.err.println(ex);
        } finally {
            session.close();
        }

        return new ArrayList<>();
    }
}
