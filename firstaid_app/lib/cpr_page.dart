import 'package:flutter/material.dart';

class CPRPage extends StatelessWidget {
  const CPRPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('CPR')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          pageTitle('CPR Steps'),
          infoCard('Check responsiveness'),
          infoCard('Call emergency'),
          infoCard('Start chest compressions'),
          infoCard('Give rescue breaths'),
          infoCard('Continue until help arrives'),
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
