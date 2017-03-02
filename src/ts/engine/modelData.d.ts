export declare class ModelData {
    normals: number[];
    uvs: number[];
    vertices: number[];
    metadata: ModelMetaData;
    faces: number[];
}

export declare class ModelMetaData {
    generator: string;
    version: number;
    faces: number;
    type: string;
    normals: number;
    uvs: number;
    vertices: number;
}