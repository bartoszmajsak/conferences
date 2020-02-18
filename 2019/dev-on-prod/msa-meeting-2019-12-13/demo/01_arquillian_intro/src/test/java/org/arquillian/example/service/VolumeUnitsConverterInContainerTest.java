package org.arquillian.example.service;

import org.arquillian.example.rest.VolumeUnitsConverter;
import org.jboss.arquillian.container.test.api.Deployment;
import org.jboss.arquillian.junit.Arquillian;
import org.jboss.shrinkwrap.api.Archive;
import org.jboss.shrinkwrap.api.ShrinkWrap;
import org.jboss.shrinkwrap.api.asset.EmptyAsset;
import org.jboss.shrinkwrap.api.spec.JavaArchive;
import org.junit.Test;
import org.junit.runner.RunWith;

import javax.inject.Inject;

import static org.assertj.core.api.Assertions.assertThat;

@RunWith(Arquillian.class)
public class VolumeUnitsConverterInContainerTest {

    @Deployment
    public static Archive<?> createDeployment() {
        return ShrinkWrap.create(JavaArchive.class, "test.jar")
                .addClass(VolumeUnitsConverter.class).addPackages(true, "org.assertj")
                .addAsManifestResource(EmptyAsset.INSTANCE, "beans.xml");
    }

    @Inject
    private VolumeUnitsConverter converter;

    @Test
    public void should_convert_fluid_ounces_to_milliliters() {
        // when
        double ouncesInMl = converter.convertToMilliliters(8d);
        // then
        assertThat(ouncesInMl).isEqualTo(236.5882368d);
    }
}

