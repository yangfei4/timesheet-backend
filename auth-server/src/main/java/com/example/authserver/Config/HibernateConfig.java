package com.example.authserver.Config;

import com.fasterxml.jackson.databind.annotation.JsonAppend;
import org.hibernate.jpa.boot.internal.EntityManagerFactoryBuilderImpl;
import org.hibernate.jpa.boot.spi.EntityManagerFactoryBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import org.springframework.orm.hibernate5.HibernateTransactionManager;
import org.springframework.orm.hibernate5.LocalSessionFactoryBean;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.sql.DataSource;
import java.util.Properties;

@Configuration
@EnableTransactionManagement
public class HibernateConfig {
    private HibernateProperty hibernateProperty;

    @Autowired
    public void setHibernateConfig(HibernateProperty hibernateProperty) {
        this.hibernateProperty = hibernateProperty;
    }

//    @Bean
//    public LocalSessionFactoryBean sessionFactory() {
//        LocalSessionFactoryBean sessionFactory = new LocalSessionFactoryBean();
//        sessionFactory.setDataSource(dataSource());
//        sessionFactory.setPackagesToScan("com.example.authserver.Domain");
//        sessionFactory.setHibernateProperties(hibernateProperties());
//
//        return sessionFactory;
//    }

    @Bean
    public LocalContainerEntityManagerFactoryBean entityManagerFactory() {
        LocalContainerEntityManagerFactoryBean entityManagerFactory = new LocalContainerEntityManagerFactoryBean();
        entityManagerFactory.setDataSource(dataSource());
        entityManagerFactory.setPackagesToScan("com.example.authserver.Domain");
        entityManagerFactory.setJpaVendorAdapter(new HibernateJpaVendorAdapter());
        entityManagerFactory.setJpaProperties(hibernateProperties());

        return entityManagerFactory;
    }

    @Bean
    public DataSource dataSource() {
        DriverManagerDataSource dataSource = new DriverManagerDataSource();
        dataSource.setUrl(hibernateProperty.getUrl());
        dataSource.setUsername(hibernateProperty.getUsername());
        dataSource.setDriverClassName(hibernateProperty.getDriver());
        dataSource.setPassword(hibernateProperty.getPassword());

        return dataSource;
    }

    @Bean(name = "transactionManager")
    public PlatformTransactionManager hibernateTransactionManager() {
        // HibernateTransactionManager hibernateTransactionManage = new HibernateTransactionManager();
        // hibernateTransactionManager.setSessionFactory(sessionFactory().getObject());
        // return hibernateTransactionManager;
        JpaTransactionManager transactionManager = new JpaTransactionManager();
        transactionManager.setEntityManagerFactory(entityManagerFactory().getObject());

        return transactionManager;
    }

    private final Properties hibernateProperties() {
        Properties hibernateProperties = new Properties();
        hibernateProperties.setProperty("hibernate.show-sql", hibernateProperty.getShowsql());
        hibernateProperties.setProperty("hibernate.dialect", hibernateProperty.getDialect());

        return hibernateProperties;
    }
}
