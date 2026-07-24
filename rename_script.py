import os

renames = {
    "PIJAMAS/Abrazo. talla M. $40.000.jpeg": "PIJAMAS/Abrazo. Talla M. $40.000.jpeg",
    "PIJAMAS/Ensueño.Talla.S. $40.000.jpeg": "PIJAMAS/Ensueño. Talla S. $40.000.jpeg",
    "PIJAMAS/Erotica. talla M. $80.000.webp": "PIJAMAS/Erótica. Talla M. $80.000.webp",
    "PIJAMAS/LavandaTalla S. 40.000.jpeg": "PIJAMAS/Lavanda. Talla S. $40.000.jpeg",
    "PIJAMAS/Mimos. Talla M. $45.0000.webp": "PIJAMAS/Mimos. Talla M. $45.000.webp",
    "PIJAMAS/Rosas.Talla S.$50.000.jpeg": "PIJAMAS/Rosas. Talla S. $50.000.jpeg",
    "PIJAMAS/champagneTalla s. 40.000 (2).jpeg": "PIJAMAS/Champagne. Talla S. $40.000.jpeg",
    "PIJAMAS/destello.Talla M. $40.000.jpeg": "PIJAMAS/Destello. Talla M. $40.000.jpeg",
    "PIJAMAS/encanto.Talla s. $50.000.jpeg": "PIJAMAS/Encanto. Talla S. $50.000.jpeg",
    "PIJAMAS/ilusicón.Talla M. $50.000.jpeg": "PIJAMAS/Ilusión. Talla M. $50.000.jpeg",
    "PIJAMAS/melodia.Talla M. $60.000.jpeg": "PIJAMAS/Melodía. Talla M. $60.000.jpeg",
    "PIJAMAS/perla.Talla s.40.000.jpeg": "PIJAMAS/Perla. Talla S. $40.000.jpeg",
    "PIJAMAS/selene.Talla M. $40.000 (2).jpeg": "PIJAMAS/Selene. Talla M. $40.000.jpeg",
    "PIJAMAS/vainilla.Talla m. $40.000.jpeg": "PIJAMAS/Vainilla. Talla M. $40.000.jpeg",
    "Lenceria/Encanto Rosè. Talla S.$65.000.webp": "Lenceria/Encanto Rosé. Talla S. $65.000.webp",
    "Lenceria/Esencia. Talla S y Xl. $50.000.webp": "Lenceria/Esencia. Talla S y XL. $50.000.webp",
    "Lenceria/Extasis Azul. Talla M. $50.000.webp": "Lenceria/Éxtasis Azul. Talla M. $50.000.webp",
    "Lenceria/Cherry Kiss. Talla Unica. $35.000.webp": "Lenceria/Cherry Kiss. Talla Única. $35.000.webp",
}

for old, new in renames.items():
    if os.path.exists(old):
        os.rename(old, new)
        print(f"Renamed: {old} -> {new}")
    else:
        print(f"Not found: {old}")
