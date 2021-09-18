import React, { useEffect } from                  'react'                          ;
import logo from                                  './logo.svg'                     ;
import                                            './App.css'                      ;
import                                            './molstar.css'                  ;
import { DefaultPluginUISpec, PluginUISpec } from 'molstar/lib/mol-plugin-ui/spec' ;
import { createPluginAsync } from                 'molstar/lib/mol-plugin-ui/index';
import { PluginConfig } from                      'molstar/lib/mol-plugin/config'  ;
import { PluginContext } from                     'molstar/lib/mol-plugin/context' ;
import { Model } from                             'molstar/lib/mol-model/structure';
import { MmcifFormat } from 'molstar/lib/mol-model-formats/structure/mmcif';
// * ------------------------------------------- MolstarWrapper
const MySpec: PluginUISpec = {
    ...DefaultPluginUISpec(),
    config: [
        [PluginConfig.VolumeStreaming.Enabled, false]
    ]
}
async function createPlugin(parent: HTMLElement) {
    const plugin     = await        createPluginAsync                          (  parent         , MySpec                      );
    const data       = await plugin.builders.data.download            ({ url   : '...' }, { state: { isGhost: true } });
    const trajectory = await plugin.builders.structure.parseTrajectory(  data           , 'mmcif'                     );


    //? Accessing sequences inside a structure
    // 1.find the releavnt chain inside a structure (use molscript?: ask for a particular chain id --> get back a structure)
    // trajectory.data?.representative is a Structure object


  // https://github.com/molstar/molstar/blob/master/src/mol-plugin-state/helpers/structure-selection-query.ts
  // Sequence ex.: https://github.com/molstar/molstar/blob/master/src/mol-plugin-ui/sequence.tsx#L97-L125
  // For each model, multiple assemblies might be defined. 


    //? const x = trajectory.data?.representative.sourceData
    //? if (MmcifFormat.is(x)){
    //?   x.data.db.      //<-----------------------Accesing mmcif properties 
    //? }
    


    // ?------------*---------------------------------
// *https://github.com/molstar/molstar/blob/master/src/mol-plugin-ui/sequence.tsx#L97-L125
//     function getModelEntityOptions(structure: Structure, polymersOnly = false) {
//     const options: [string, string][] = [];
//     const l = StructureElement.Location.create(structure);
//     const seen = new Set<string>();

//     for (const unit of structure.units) {
//         StructureElement.Location.set(l, structure, unit, unit.elements[0]);
//         const id = SP.entity.id(l); //* <------- SP is the getter for structure properties
//         const modelIdx = structure.getModelIndex(unit.model);
//         const key = `${modelIdx}|${id}`;
//         if (seen.has(key)) continue;
//         if (polymersOnly && SP.entity.type(l) !== 'polymer') continue;

//         let description = SP.entity.pdbx_description(l).join(', ');
//         if (structure.models.length) {
//             if (structure.representativeModel) { // indicates model trajectory
//                 description += ` (Model ${structure.models[modelIdx].modelNum})`;
//             } else if (description.startsWith('Polymer ')) { // indicates generic entity name
//                 description += ` (${structure.models[modelIdx].entry})`;
//             }
//         }
//         const label = `${id}: ${description}`;
//         options.push([key, label]);
//         seen.add(key);
//     }

//     if (options.length === 0) options.push(['', 'No entities']);
//     return options;
// }

    // ?------------*---------------------------------


// * https://github.com/molstar/molstar/tree/master/src/mol-state 
// Multiple structs, updating state tree, see defs.



    await plugin.builders.structure.hierarchy.applyPreset(trajectory, 'default');
    // plugin.managers.structure.hierarchy
    // plugin.managers.structure.focus.setFromLoci() //* Explore Loci and Geometry type
    // plugin.state.data.
    plugin.managers.interactivity.lociHighlights.addProvider(
      (loci, action, noRender) => {
        console.log(
          { loci,action,noRender }
        );
        }
    )

    // ? Presets (for cutting out parts of structs) 
    // https://github.com/molstar/molstar/blob/master/src/mol-plugin-state/builder/structure/representation-preset.ts#146
    // 1. define components (subsets of whole )
    // 2. apply representation to components


    // Example : https://github.com/molstar/molstar/blob/8c417ef35ce1d6c63712ed5b331423812a1cfc9d/src/mol-plugin-state/builder/structure/representation-preset.ts#L390-L392
    // #? MS == MolQL selection language 
    


    // IHM , PDBdev?, augmented mccif



    



    return plugin;
}


function App() {
    // const parent = React.createRef<HTMLDivElement | null>();
  const parent = React.createRef<HTMLDivElement >();

    useEffect(() => {
        let plugin: PluginContext | undefined = undefined;
        async function init() {
          if (parent.current === null){
            return
          }
            plugin = await createPlugin(parent.current);
        }
        
        init();
        return () => { plugin?.dispose(); };
    }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>


      <div style={{width:"450px", height:"600px"}} ref={parent}/>
    </div>
  );
}

export default App;
