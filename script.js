
    function generateGanttChart() {
      // Clear any previous errors
      document.getElementById("errorMessages").innerHTML = "";

      // Retrieve input values
      var processes = parseInt(document.getElementById("processes").value);
      var arrivalTimes = document.getElementById("arrivalTimes").value.trim();
      var burstTimes = document.getElementById("burstTimes").value.trim();
      var algorithm = document.getElementById("algorithm").value;
      var timeQuantumInput = parseInt(
        document.getElementById("timeQuantumInput").value
      );
      // var priorityValues = document.getElementById("priorityValues").value.trim();
      // Validate input values
      if (isNaN(processes) || processes <= 0) {
        displayError("Number of processes must be a positive integer.");
        return;
      }

      var arrivalArray = arrivalTimes.split(",");
      var burstArray = burstTimes.split(",");
      // var priorityArray = priorityValues.split(",");

      if (
        arrivalArray.length !== processes ||
        burstArray.length !== processes
      ) {
        displayError(
          "Number of arrival times and burst times must match the number of processes."
        );
        return;
      }

      for (var i = 0; i < processes; i++) {
        if (
          isNaN(parseInt(arrivalArray[i])) ||
          isNaN(parseInt(burstArray[i])) ||
          parseInt(arrivalArray[i]) < 0 ||
          parseInt(burstArray[i]) <= 0
        ) {
          displayError(
            "Arrival times and burst times must be non-negative integers."
          );
          return;
        }
      }

      // Perform scheduling based on selected algorithm
      var completionTimes = [];
      var turnaroundTimes = [];
      var waitingTimes = [];

      if (algorithm === "FCFS") {
        performFCFS(
          processes,
          arrivalArray,
          burstArray,
          completionTimes,
          turnaroundTimes,
          waitingTimes
        );
      } else if (algorithm === "SJF") {
        // Add SJF implementation here
        performSJF(
          processes,
          arrivalArray,
          burstArray,
          completionTimes,
          turnaroundTimes,
          waitingTimes
        );
      } else if (algorithm === "LJF") {
        // Add LJF implementation here
        performLJF(
          processes,
          arrivalArray,
          burstArray,
          completionTimes,
          turnaroundTimes,
          waitingTimes
        );
      } else if (algorithm === "SRTF") {
        // Add LJF implementation here
        performSRTF(
          processes,
          arrivalArray,
          burstArray,
          completionTimes,
          turnaroundTimes,
          waitingTimes
        );
      } else if (algorithm === "LRTF") {
        // Add LJF implementation here
        performLRTF(
          processes,
          arrivalArray,
          burstArray,
          completionTimes,
          turnaroundTimes,
          waitingTimes
        );
      } else {
        // Handle unsupported algorithm
        displayError("Selected algorithm is not supported.");
        return;
      }

      // Generate Gantt Chart and display results
      displayResults(
        processes,
        arrivalArray,
        burstArray,
        completionTimes,
        turnaroundTimes,
        waitingTimes
      );
    }
    function performSRTF(
      processes,
      arrivalArray,
      burstArray,
      completionTimes,
      turnaroundTimes,
      waitingTimes
    ) {
      // Create copies of burstArray and remaining time arrays
      var remainingTime = [...burstArray];
      var currentTime = 0;
      var executedProcesses = 0;

      while (executedProcesses < processes) {
        var shortestIndex = -1;
        var shortestTime = Infinity;

        // Find the process with the shortest remaining burst time available at current time
        for (var i = 0; i < processes; i++) {
          if (
            parseInt(arrivalArray[i]) <= currentTime &&
            remainingTime[i] < shortestTime &&
            remainingTime[i] > 0
          ) {
            shortestIndex = i;
            shortestTime = remainingTime[i];
          }
        }

        if (shortestIndex === -1) {
          currentTime++;
          continue;
        }

        // Execute the process with the shortest remaining burst time for one time unit
        remainingTime[shortestIndex]--;
        currentTime++;

        // If the process is completed
        if (remainingTime[shortestIndex] === 0) {
          // Update completion time
          completionTimes[shortestIndex] = currentTime;

          // Calculate turnaround time and waiting time
          turnaroundTimes[shortestIndex] =
            completionTimes[shortestIndex] -
            parseInt(arrivalArray[shortestIndex]);
          waitingTimes[shortestIndex] =
            turnaroundTimes[shortestIndex] -
            parseInt(burstArray[shortestIndex]);

          executedProcesses++;
        }
      }
    }

    function performFCFS(
      processes,
      arrivalArray,
      burstArray,
      completionTimes,
      turnaroundTimes,
      waitingTimes
    ) {
      var currentTime = 0;

      for (var i = 0; i < processes; i++) {
        if (currentTime < parseInt(arrivalArray[i])) {
          currentTime = parseInt(arrivalArray[i]);
        }

        completionTimes[i] = currentTime + parseInt(burstArray[i]);
        turnaroundTimes[i] = completionTimes[i] - parseInt(arrivalArray[i]);
        waitingTimes[i] = turnaroundTimes[i] - parseInt(burstArray[i]);

        currentTime = completionTimes[i];
      }
    }
    function performSJF(
      processes,
      arrivalArray,
      burstArray,
      completionTimes,
      turnaroundTimes,
      waitingTimes
    ) {
      var currentTime = 0;
      var remainingBurst = [...burstArray]; // Create a copy of burstArray to track remaining burst time

      for (var i = 0; i < processes; i++) {
        // Find the shortest job available at currentTime
        var shortestJobIndex = findShortestJob(
          remainingBurst,
          arrivalArray,
          currentTime
        );

        // If no process available, move currentTime to the next process arrival time
        if (shortestJobIndex === -1) {
          currentTime = parseInt(arrivalArray[i]);
          shortestJobIndex = findShortestJob(
            remainingBurst,
            arrivalArray,
            currentTime
          );
        }

        // Update completion, turnaround, and waiting times
        completionTimes[shortestJobIndex] =
          currentTime + parseInt(remainingBurst[shortestJobIndex]);
        turnaroundTimes[shortestJobIndex] =
          completionTimes[shortestJobIndex] -
          parseInt(arrivalArray[shortestJobIndex]);
        waitingTimes[shortestJobIndex] =
          turnaroundTimes[shortestJobIndex] -
          parseInt(burstArray[shortestJobIndex]);

        // Update currentTime and remaining burst time
        currentTime = completionTimes[shortestJobIndex];
        remainingBurst[shortestJobIndex] = 0; // Set remaining burst time to 0 for completed process
      }
    }

    // Helper function to find the shortest job available at a given time
    function findShortestJob(remainingBurst, arrivalArray, currentTime) {
      var shortestTime = Infinity;
      var shortestIndex = -1;

      for (var i = 0; i < remainingBurst.length; i++) {
        if (
          parseInt(arrivalArray[i]) <= currentTime &&
          remainingBurst[i] > 0 &&
          remainingBurst[i] < shortestTime
        ) {
          shortestTime = remainingBurst[i];
          shortestIndex = i;
        }
      }

      return shortestIndex;
    }
    function performLRTF(
      processes,
      arrivalArray,
      burstArray,
      completionTimes,
      turnaroundTimes,
      waitingTimes
    ) {
      // Create copies of burstArray and remaining time arrays
      var remainingTime = [...burstArray];
      var currentTime = 0;
      var executedProcesses = 0;

      while (executedProcesses < processes) {
        var longestIndex = -1;
        var longestTime = -Infinity;

        // Find the process with the longest remaining burst time available at current time
        for (var i = 0; i < processes; i++) {
          if (
            parseInt(arrivalArray[i]) <= currentTime &&
            remainingTime[i] > longestTime &&
            remainingTime[i] > 0
          ) {
            longestIndex = i;
            longestTime = remainingTime[i];
          }
        }

        if (longestIndex === -1) {
          currentTime++;
          continue;
        }

        // Execute the process with the longest remaining burst time for one time unit
        remainingTime[longestIndex]--;
        currentTime++;

        // If the process is completed
        if (remainingTime[longestIndex] === 0) {
          // Update completion time
          completionTimes[longestIndex] = currentTime;

          // Calculate turnaround time and waiting time
          turnaroundTimes[longestIndex] =
            completionTimes[longestIndex] -
            parseInt(arrivalArray[longestIndex]);
          waitingTimes[longestIndex] =
            turnaroundTimes[longestIndex] - parseInt(burstArray[longestIndex]);

          executedProcesses++;
        }
      }
    }

    function performLJF(
      processes,
      arrivalArray,
      burstArray,
      completionTimes,
      turnaroundTimes,
      waitingTimes
    ) {
      // Create a copy of burstArray to track remaining burst time
      var remainingBurst = [...burstArray];
      var currentTime = 0;
      var executedProcesses = 0;

      while (executedProcesses < processes) {
        var longestBurstIndex = -1;
        var longestBurst = -Infinity;

        // Find the process with the longest burst time available at currentTime
        for (var i = 0; i < processes; i++) {
          if (
            parseInt(arrivalArray[i]) <= currentTime &&
            remainingBurst[i] > longestBurst
          ) {
            longestBurst = remainingBurst[i];
            longestBurstIndex = i;
          }
        }

        // If no process available, move currentTime to the next process arrival time
        if (longestBurstIndex === -1) {
          var nextArrival = Infinity;
          for (var j = 0; j < processes; j++) {
            if (
              parseInt(arrivalArray[j]) > currentTime &&
              parseInt(arrivalArray[j]) < nextArrival
            ) {
              nextArrival = parseInt(arrivalArray[j]);
            }
          }
          currentTime = nextArrival;
          continue;
        }

        // Execute the process with the longest burst time
        currentTime += parseInt(remainingBurst[longestBurstIndex]);
        remainingBurst[longestBurstIndex] = 0;

        // Update completion, turnaround, and waiting times
        completionTimes[longestBurstIndex] = currentTime;
        turnaroundTimes[longestBurstIndex] =
          completionTimes[longestBurstIndex] -
          parseInt(arrivalArray[longestBurstIndex]);
        waitingTimes[longestBurstIndex] =
          turnaroundTimes[longestBurstIndex] -
          parseInt(burstArray[longestBurstIndex]);

        executedProcesses++;
      }
    }

    // Helper function to find the longest job available at a given time
    function findLongestJob(remainingBurst, arrivalArray, currentTime) {
      var longestTime = -Infinity;
      var longestIndex = -1;

      for (var i = 0; i < remainingBurst.length; i++) {
        if (
          parseInt(arrivalArray[i]) <= currentTime &&
          remainingBurst[i] > 0 &&
          remainingBurst[i] > longestTime
        ) {
          longestTime = remainingBurst[i];
          longestIndex = i;
        }
      }

      return longestIndex;
    }

    function displayResults(
      processes,
      arrivalArray,
      burstArray,
      completionTimes,
      turnaroundTimes,
      waitingTimes
    ) {
      var ganttChart = document.getElementById("ganttChart");
      ganttChart.innerHTML = "";

      var table = document.createElement("table");
      var headerRow = table.insertRow(0);
      headerRow.innerHTML =
        "<th>Process</th><th>Arrival Time</th><th>Burst Time</th><th>Completion Time</th><th>Turnaround Time</th><th>Waiting Time</th>";

      for (var i = 0; i < processes; i++) {
        var row = table.insertRow(i + 1);
        row.innerHTML =
          "<td>" +
          (i + 1) +
          "</td><td>" +
          arrivalArray[i] +
          "</td><td>" +
          burstArray[i] +
          "</td><td>" +
          completionTimes[i] +
          "</td><td>" +
          turnaroundTimes[i] +
          "</td><td>" +
          waitingTimes[i] +
          "</td>";
      }

      ganttChart.appendChild(table);
    }

    function displayError(errorMessage) {
      var errorContainer = document.getElementById("errorMessages");
      var errorElement = document.createElement("p");
      errorElement.classList.add("error");
      errorElement.innerHTML = errorMessage;
      errorContainer.appendChild(errorElement);
    }
