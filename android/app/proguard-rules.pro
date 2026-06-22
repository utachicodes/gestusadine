# Add project specific ProGuard rules here.
-keep class com.gestusadine.widget.** { *; }
-keepclassmembers class kotlinx.serialization.** { *; }
-keepattributes *Annotation*, InnerClasses
-dontnote kotlinx.serialization.AnnotationsKt
