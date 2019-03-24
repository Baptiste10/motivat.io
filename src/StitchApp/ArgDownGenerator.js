class ArgDownGenerator {
    constructor(name, relationships){
        this.name = name;
        this.relationships = relationships;
        this.mapped_relations = [];
        this.map = ['# '+ this.name];
        this.connect_nodes();
    }

    connect_nodes = () => {
        for (index, relation of this.relationships) {
            if (!(this.mapped_relations.include(index))){
                this.map.push('\n');
                this.map.push(relation.boss.complete_node())
                this.next_mapped_relations([relation.boss], 1)
            }
        }
    }

    next_mapped_relations = (relations_to_map_in_order, tabs) => {
        var last_relation = relations_to_map_in_order[-1];
        var attribute_nested_attributes_index = this.has_attributes(last_relation);
        if (attribute_nested_attributes_index.length != 0) {
            for (index of attribute_nested_attributes_index) {
                relations_to_map_in_order.push(this.relationships[index].attribute);
                this.map.push('\t'*tabs + this.relationships[index].role + this.relationships[index].attribute.complete_node());
                this.mapped_relations.push(index);
                this.next_mapped_relations(relations_to_map_in_order, tabs+1);
            }
        }
    }

    has_attributes = (node) => {
        var attributes_index = [];
        for (index, relation of this.relationships) {
            if (!(mapped_relations.include(index)) && node == relation.boss) {
                attributes_index.push(index)
            }
        }
        return attributes_index
    }

}

export default ArgDownGenerator