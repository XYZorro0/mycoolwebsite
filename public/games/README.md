# Game assets

## DOOM (shareware)

To enable DOOM, drop the freely-redistributable shareware WAD here as `doom1.wad`:

```bash
# from the repo root, on the Mac Mini:
curl -L -o public/games/doom1.wad https://distro.ibiblio.org/slitaz/sources/packages/d/doom1.wad
```

Other reliable mirrors:
- https://archive.org/download/DoomsharewareEpisode/doom1.wad
- https://www.doomworld.com/idgames/?file=idstuff/doom/doom19s.zip (then extract `doom1.wad`)

The shareware WAD is the "DOOM 1, Episode 1" data file id Software released for free
distribution. The js-dos runtime loaded at runtime mounts it inside DOSBox along with
the embedded `doom.exe`.

If you'd prefer a fully-prebuilt bundle, set
`NEXT_PUBLIC_DOOM_BUNDLE=https://example.com/doom.jsdos` in `.env.local` and the
component will use that bundle URL instead.

## Why isn't this committed?

The WAD is freely redistributable but:
- not GPL/MIT, so it doesn't belong in source control as code
- ~3 MB binary that bloats the repo
- the asset is server-side only — browsers fetch it from `/games/doom1.wad` at runtime
