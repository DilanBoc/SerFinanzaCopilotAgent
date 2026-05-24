# Modelos Locales

Esta carpeta puede contener modelos compatibles con `faster-whisper`.

Estructura esperada:

```text
models/
  faster-whisper-base/
    config.json
    model.bin
    tokenizer.json
    vocabulary.txt
  faster-whisper-small/
    config.json
    model.bin
    tokenizer.json
    vocabulary.txt
```

Los modelos no se versionan en Git porque son archivos pesados.

Uso:

```powershell
$env:WHISPER_MODEL_SIZE='base'
python main.py
```

o:

```powershell
$env:WHISPER_MODEL_SIZE='small'
python main.py
```
