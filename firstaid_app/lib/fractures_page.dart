import 'package:flutter/material.dart';

class FracturesPage extends StatelessWidget {
  const FracturesPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Fractures')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          pageTitle('First Aid for Fractures'),
          infoCard('Do not move injured part'),
          infoCard('Immobilize using splint'),
          infoCard('Apply ice'),
          infoCard('Do not realign bone'),
          infoCard('Get medical help'),
        ],
      ),
    );
  }
}
Widget pageTitle(String text) {
  return Padding(
    padding: const EdgeInsets.only(bottom: 20),
    child: Text(
      text,
      style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
    ),
  );
}

Widget infoCard(String text) {
  return Card(
    margin: const EdgeInsets.only(bottom: 12),
    child: Padding(
      padding: const EdgeInsets.all(14),
      child: Row(
        children: [
          const Icon(Icons.check_circle, color: Colors.green),
          const SizedBox(width: 12),
          Expanded(
            child: Text(text, style: const TextStyle(fontSize: 16)),
          ),
        ],
      ),
    ),
  );
}
