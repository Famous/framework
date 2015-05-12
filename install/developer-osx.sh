#!/usr/bin/env bash

mkdir best-framework
cd best-framework

git clone git@github.famo.us:framework/ecosystem.git
git clone git@github.famo.us:framework/es.git
git clone git@github.famo.us:framework/components.git
git clone git@github.famo.us:framework/assistant.git
git clone git@github.famo.us:framework/workspace.git
git clone git@github.famo.us:framework/runtime.git
git clone git@github.famo.us:framework/utilities.git
git clone git@github.famo.us:framework/state-manager.git

cd ecosystem && npm link && cd ..
cd es && npm link && cd ..
cd components && npm link && cd ..
cd assistant && npm link && cd ..
cd workspace && npm link && cd ..
cd runtime && npm link && cd ..
cd utilities && npm link && cd ..
cd state-manager && npm link && cd ..

cd ecosystem
npm link best-es
cd ..

cd runtime
npm link framework-utilities
npm link best-state-manager
cd ..

cd workspace
npm link best-assistant
npm link best-components
npm link best-ecosystem
npm link best-runtime
cd ..
