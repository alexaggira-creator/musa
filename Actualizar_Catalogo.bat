@echo off
echo Actualizando el catalogo localmente...
python update_catalog.py

echo.
echo Subiendo los cambios a GitHub...
git add .
git commit -m "Actualizacion automatica del catalogo"
git push

echo.
echo Cambios subidos correctamente. Ya puedes verlos en tu pagina.
pause
