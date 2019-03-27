// Server-Side: Converts a list of edges into argdown code

function ArgDownGenerator (name, relationships){
    
    const name = name;
    const relationships = relationships;
    var mapped_relations = [];
    var map = ['# '+ name];
    connect_nodes();


    connect_nodes = () => {
        for (index, relation of relationships) {
            if (!(mapped_relations.include(index))){
                map.push('\n');
                map.push(relation.boss.complete_node())
                next_mapped_relations([relation.boss], 1)
            }
        }
    }

    next_mapped_relations = (relations_to_map_in_order, tabs) => {
        var last_relation = relations_to_map_in_order[-1];
        var attribute_nested_attributes_index = has_attributes(last_relation);
        if (attribute_nested_attributes_index.length != 0) {
            for (index of attribute_nested_attributes_index) {
                relations_to_map_in_order.push(relationships[index].attribute);
                map.push('\t'*tabs + relationships[index].role + relationships[index].attribute.complete_node());
                mapped_relations.push(index);
                next_mapped_relations(relations_to_map_in_order, tabs+1);
            }
        }
    }

    has_attributes = (node) => {
        var attributes_index = [];
        for (index, relation of relationships) {
            if (!(mapped_relations.include(index)) && node == relation.boss) {
                attributes_index.push(index)
            }
        }
        return attributes_index
    }
}