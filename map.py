import json

import networkx as nx
import matplotlib.pyplot as plt

G = nx.DiGraph()


class Place(object):
    def __init__(self, id, name, owner, url, roleplay_id):
        self.id = id
        self.name = name
        self.owner = owner
        self.url = url
        self.roleplay_id = roleplay_id


class Exit(object):
    def __init__(self, place_id, destination_id, direction, mode):
        self.place_id = place_id
        self.destination_id = destination_id
        self.direction = direction
        self.mode = mode


def load_places():
    with open("places.json") as places_file:
        def json2place(j):
            return Place(int(j["id"]), j["name"], int(j["owner"]), j["url"], int(j["roleplay_id"]))
        return map(json2place, json.load(places_file))


def load_exits():
    with open("exits.json") as exits_file:
        def json2exit(j):
            return Exit(int(j["place_id"]), int(j["destination_id"]), j["direction"], j["mode"])
        return json.load(exits_file)


places = load_places()
for place in places:
    G.add_node(
        place.id,
        {"name": place.name, "owner": place.owner, "url": place.url, "roleplay_id": place.roleplay_id})

exits = load_exits()
for exit in exits:
    G.add_edge(
        exit.place_id,
        exit.destination_id,
        {"direction": exit.direction, "mode": exit.mode})

nx.draw(G)
nx.write_dot(G,'file.dot')