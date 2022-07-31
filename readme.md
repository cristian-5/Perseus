
# Perseus Latin Dictionary

Latin dictionary for `macOS` from the **Perseus Project**.

Text provided under a CC BY-SA license by Perseus Digital Library,
http://www.perseus.tufts.edu, with funding from
The National Endowment for the Humanities.
Data accessed from https://github.com/PerseusDL/lexica/ during 2022.
Repo: https://github.com/PerseusDL/lexica/

## Installation

Copy the `Latin.dictionary` folder (which you can find under `objects`)
in the Apple Dictionary folder.\\
The folder location gets updated every year so check with Apple docs.

## Suggest Changes

To suggest changes, please open an issue.

## Build Intructions

For those who wish to build their own versions,
make sure to edit the `Makefile` to point to the correct location of the
`Apple Dictionary Development Kit` folder.

To build the `Latin.xml` file:

```sh
deno run --allow-all parse.js
```

To build the project:

```sh
make all
```