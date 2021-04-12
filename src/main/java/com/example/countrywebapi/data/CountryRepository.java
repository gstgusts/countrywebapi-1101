package com.example.countrywebapi.data;

import org.hibernate.HibernateException;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.cfg.Configuration;
import org.hibernate.query.Query;

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

    public Country getById(int id) {
        var session = factory.openSession();

        try {
            return session.get(Country.class, id);
        } catch (HibernateException ex) {
            System.err.println(ex);
        } finally {
            session.close();
        }

        return null;
    }

    public List<Country> searchByName(String name) {
        var session = factory.openSession();

        try {
            String hql = "FROM Country C WHERE C.name like :name";
            Query query = session.createQuery(hql);
            query.setParameter("name","%"+name+"%");
            return query.list();
        } catch (HibernateException ex) {
            System.err.println(ex);
        } finally {
            session.close();
        }

        return new ArrayList<>();
    }

    public void save(Object item) {
        var session = factory.openSession();
        Transaction tx = null;

        try {
            tx = session.beginTransaction();
            session.save(item);
            tx.commit();
        } catch (HibernateException ex) {
            if(tx != null) {
                tx.rollback();
            }
            System.err.println(ex);
        } finally {
            session.close();
        }
    }
}
