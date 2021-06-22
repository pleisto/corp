# frozen_string_literal: true
# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

users = 5.times.map do |n|
  Accounts::User.create!(name: "ADMIN#{n}", password: "PASSWORD#{n}", email: "ADMIN#{n}@brickdoc.com", webid: "ADMIN#{n}")
end
pods = users.map { |u| u.pods.first }

BLOCK_TYPE = 'page'
COLLABORATOR_COUNT = 1..5
BLOCKS_COUNT = 5..5
SECOND_LEVEL_CHILDREN_COUNT = 50..10
THIRD_LEVEL_CHILDREN_COUNT = 5..10

BLOCK_SEEDS = [5..5, 50..100, 200..300]

def random_collaborators(pod, pods)
  (pods.sample(COLLABORATOR_COUNT.to_a.sample) + [pod]).map(&:id).uniq
end

def create_block(pod, id, parent_id, children, pods)
  params = {
    id: id,
    pod: pod,
    type: BLOCK_TYPE,
    collaborators: random_collaborators(pod, pods),
    meta: { title: FFaker::Lorem.phrase },
    data: { paragraphs: FFaker::DizzleIpsum.paragraphs },
    parent_id: parent_id,
    children: children
  }
  params[:parent_type] = BLOCK_TYPE if params[:parent_id]
  Docs::Block.create!(params)
end

parent_map = BLOCK_SEEDS.reduce([{}, []]) do |(result, prev), seed|
  uuids = seed.to_a.sample.times.to_a.map { SecureRandom.uuid }
  uuids.each { |uuid| result[uuid] = prev.sample }
  [result, uuids]
end.first

children_map = parent_map.each_with_object({}) do |(k, v), result|
  result[v] = result[v].to_a + [k] unless v.nil?
end

ROOT_POD = pods.first
(parent_map.keys + parent_map.values).compact.uniq.each do |uuid|
  create_block(ROOT_POD, uuid, parent_map[uuid], children_map[uuid].to_a, pods)
end

#### Snapshot and history

root_block = Docs::Block.find_by!(parent_id: nil)

## Automatic save history when edit
root_block.update!(meta: root_block.meta.merge('changed' => true))

## Manual save snapshot
root_block.update!(snapshot_version: root_block.snapshot_version + 1)
