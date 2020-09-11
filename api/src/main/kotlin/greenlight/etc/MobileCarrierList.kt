package greenlight.etc



import com.fasterxml.jackson.core.type.TypeReference
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory
import com.fasterxml.jackson.module.kotlin.KotlinModule
import org.yaml.snakeyaml.Yaml
import java.io.File
import java.io.FileReader
import java.nio.file.Files
import java.nio.file.Path

// Inspired by https://joelforjava.com/blog/2019/11/19/parsing-yaml-using-kotlin-objects.html

data class Carrier(val id: String , val name: String, val sms_domain: String, val mms_domain: String?)


fun loadFromFile(path: String): List<Carrier> {

    val file = File(Util.resourceURI(path))
    if (!file.exists()) {
        throw IllegalArgumentException("Could not find file '$path'")
    }

    val mapper = ObjectMapper(YAMLFactory()) // Enable YAML parsing
    mapper.registerModule(KotlinModule()) // Enable Kotlin support


    return FileReader(file).use {
        mapper.readValue(it, mapper.typeFactory.constructCollectionType(List::class.java, Carrier::class.java))
    }
}
// MyClass[] myObjects = mapper.readValue(json, MyClass[].class);

object MobileCarrierList {
    private val carriers = loadFromFile("data/mobile-carriers.yml")

    fun ids(): List<String> {
        return carriers.map { it.id }
    }

    fun find(id: String): Carrier {
        return carriers.first { c -> c.id == id }
    }
}
